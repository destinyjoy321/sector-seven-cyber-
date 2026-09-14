import { supabase, supabaseAdmin } from './supabaseClient';
import { getStoredApplications } from './storage';

export interface RetentionPolicy {
  retentionDays: number;
  autoDeleteEnabled: boolean;
}

export const DEFAULT_RETENTION_POLICY: RetentionPolicy = {
  retentionDays: 30,
  autoDeleteEnabled: true,
};

/**
 * Section 23 — Automated Data Retention Cleanup
 * Lifecycle: Application Received -> Questionnaire Stored -> Business Review -> Acquisition Decision -> Retention Window -> Automated Deletion
 */
export async function executeAutomatedRetentionCleanup(daysThreshold: number = 30): Promise<{ deletedCount: number; purgedFiles: string[] }> {
  const cutoffDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000).toISOString();
  let deletedCount = 0;
  const purgedFiles: string[] = [];

  // 1. Local Storage Purge
  try {
    const currentApps = getStoredApplications();
    const activeApps = currentApps.filter(app => {
      const isExpired = new Date(app.created_at).toISOString() < cutoffDate;
      if (isExpired) {
        if (app.file_path) purgedFiles.push(app.file_path);
        deletedCount++;
        return false;
      }
      return true;
    });
    localStorage.setItem('sector_seven_applications_db', JSON.stringify(activeApps));
  } catch (e) {
    console.warn('Local retention cleanup notice:', e);
  }

  // 2. Supabase Storage & Database Purge
  try {
    const { data: expiredRecords } = await supabaseAdmin
      .from('applications')
      .select('id, file_path')
      .lt('created_at', cutoffDate);

    if (expiredRecords && expiredRecords.length > 0) {
      for (const rec of expiredRecords) {
        if (rec.file_path) {
          // Delete file from private storage
          await supabaseAdmin.storage
            .from('insurance-questionnaires')
            .remove([rec.file_path]);
          purgedFiles.push(rec.file_path);
        }
      }

      // Delete application records
      const expiredIds = expiredRecords.map((r: any) => r.id);
      await supabaseAdmin.from('applications').delete().in('id', expiredIds);
    }
  } catch (err) {
    console.warn('Supabase retention cleanup notice:', err);
  }

  return { deletedCount, purgedFiles };
}
