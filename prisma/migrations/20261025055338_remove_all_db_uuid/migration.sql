/*
  Warnings:

  - The primary key for the `api_keys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `audio_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `content_posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `daily_brief_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `daily_briefs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `deals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `email_campaigns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `email_recipients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `feature_flags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `interactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `job_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `organizations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pipelines` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `podcast_subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_analytics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_deliveries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `social_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trend_signals` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_audio_activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_trend_preferences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_user_id_fkey";

-- DropForeignKey
ALTER TABLE "audio_items" DROP CONSTRAINT "audio_items_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "content_posts" DROP CONSTRAINT "content_posts_source_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "content_posts" DROP CONSTRAINT "content_posts_source_trend_id_fkey";

-- DropForeignKey
ALTER TABLE "content_posts" DROP CONSTRAINT "content_posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "daily_brief_items" DROP CONSTRAINT "daily_brief_items_audio_id_fkey";

-- DropForeignKey
ALTER TABLE "daily_brief_items" DROP CONSTRAINT "daily_brief_items_brief_id_fkey";

-- DropForeignKey
ALTER TABLE "daily_briefs" DROP CONSTRAINT "daily_briefs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "deals" DROP CONSTRAINT "deals_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "deals" DROP CONSTRAINT "deals_pipeline_id_fkey";

-- DropForeignKey
ALTER TABLE "email_campaigns" DROP CONSTRAINT "email_campaigns_user_id_fkey";

-- DropForeignKey
ALTER TABLE "email_recipients" DROP CONSTRAINT "email_recipients_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "email_recipients" DROP CONSTRAINT "email_recipients_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "interactions" DROP CONSTRAINT "interactions_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_org_id_fkey";

-- DropForeignKey
ALTER TABLE "org_members" DROP CONSTRAINT "org_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pipelines" DROP CONSTRAINT "pipelines_user_id_fkey";

-- DropForeignKey
ALTER TABLE "podcast_subscriptions" DROP CONSTRAINT "podcast_subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_analytics" DROP CONSTRAINT "post_analytics_delivery_id_fkey";

-- DropForeignKey
ALTER TABLE "post_deliveries" DROP CONSTRAINT "post_deliveries_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_deliveries" DROP CONSTRAINT "post_deliveries_social_account_id_fkey";

-- DropForeignKey
ALTER TABLE "social_accounts" DROP CONSTRAINT "social_accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_org_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_audio_activity" DROP CONSTRAINT "user_audio_activity_audio_item_id_fkey";

-- DropForeignKey
ALTER TABLE "user_audio_activity" DROP CONSTRAINT "user_audio_activity_created_post_id_fkey";

-- DropForeignKey
ALTER TABLE "user_audio_activity" DROP CONSTRAINT "user_audio_activity_crm_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "user_audio_activity" DROP CONSTRAINT "user_audio_activity_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_trend_preferences" DROP CONSTRAINT "user_trend_preferences_trend_id_fkey";

-- DropForeignKey
ALTER TABLE "user_trend_preferences" DROP CONSTRAINT "user_trend_preferences_user_id_fkey";

-- AlterTable
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "audio_items" DROP CONSTRAINT "audio_items_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "subscription_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "audio_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "content_posts" DROP CONSTRAINT "content_posts_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "source_trend_id" SET DATA TYPE TEXT,
ALTER COLUMN "source_audio_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "content_posts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "daily_brief_items" DROP CONSTRAINT "daily_brief_items_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "brief_id" SET DATA TYPE TEXT,
ALTER COLUMN "audio_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "daily_brief_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "daily_briefs" DROP CONSTRAINT "daily_briefs_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "daily_briefs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "deals" DROP CONSTRAINT "deals_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "pipeline_id" SET DATA TYPE TEXT,
ALTER COLUMN "contact_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "deals_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "email_campaigns" DROP CONSTRAINT "email_campaigns_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "source_audio_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "email_campaigns_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "email_recipients" DROP CONSTRAINT "email_recipients_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "campaign_id" SET DATA TYPE TEXT,
ALTER COLUMN "contact_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "email_recipients_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "feature_flags" DROP CONSTRAINT "feature_flags_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "interactions" DROP CONSTRAINT "interactions_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "contact_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "source_post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "interactions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "job_logs" DROP CONSTRAINT "job_logs_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "job_logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "org_members" ALTER COLUMN "org_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pipelines" DROP CONSTRAINT "pipelines_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "podcast_subscriptions" DROP CONSTRAINT "podcast_subscriptions_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "podcast_subscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "post_analytics" DROP CONSTRAINT "post_analytics_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "delivery_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_analytics_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "post_deliveries" DROP CONSTRAINT "post_deliveries_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "social_account_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_deliveries_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "social_accounts" DROP CONSTRAINT "social_accounts_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "org_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "trend_signals" DROP CONSTRAINT "trend_signals_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "trend_signals_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_audio_activity" DROP CONSTRAINT "user_audio_activity_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "audio_item_id" SET DATA TYPE TEXT,
ALTER COLUMN "crm_contact_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_post_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_audio_activity_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_trend_preferences" DROP CONSTRAINT "user_trend_preferences_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ALTER COLUMN "trend_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_trend_preferences_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_posts" ADD CONSTRAINT "content_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_posts" ADD CONSTRAINT "content_posts_source_trend_id_fkey" FOREIGN KEY ("source_trend_id") REFERENCES "trend_signals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_posts" ADD CONSTRAINT "content_posts_source_audio_id_fkey" FOREIGN KEY ("source_audio_id") REFERENCES "audio_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_deliveries" ADD CONSTRAINT "post_deliveries_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "content_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_deliveries" ADD CONSTRAINT "post_deliveries_social_account_id_fkey" FOREIGN KEY ("social_account_id") REFERENCES "social_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_analytics" ADD CONSTRAINT "post_analytics_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "post_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trend_preferences" ADD CONSTRAINT "user_trend_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_trend_preferences" ADD CONSTRAINT "user_trend_preferences_trend_id_fkey" FOREIGN KEY ("trend_id") REFERENCES "trend_signals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_pipeline_id_fkey" FOREIGN KEY ("pipeline_id") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deals" ADD CONSTRAINT "deals_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_recipients" ADD CONSTRAINT "email_recipients_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "email_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_recipients" ADD CONSTRAINT "email_recipients_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_subscriptions" ADD CONSTRAINT "podcast_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_items" ADD CONSTRAINT "audio_items_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "podcast_subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_activity" ADD CONSTRAINT "user_audio_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_activity" ADD CONSTRAINT "user_audio_activity_audio_item_id_fkey" FOREIGN KEY ("audio_item_id") REFERENCES "audio_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_activity" ADD CONSTRAINT "user_audio_activity_crm_contact_id_fkey" FOREIGN KEY ("crm_contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_audio_activity" ADD CONSTRAINT "user_audio_activity_created_post_id_fkey" FOREIGN KEY ("created_post_id") REFERENCES "content_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_briefs" ADD CONSTRAINT "daily_briefs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_brief_items" ADD CONSTRAINT "daily_brief_items_brief_id_fkey" FOREIGN KEY ("brief_id") REFERENCES "daily_briefs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_brief_items" ADD CONSTRAINT "daily_brief_items_audio_id_fkey" FOREIGN KEY ("audio_id") REFERENCES "audio_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
