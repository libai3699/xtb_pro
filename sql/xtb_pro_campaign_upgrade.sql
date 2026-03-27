ALTER TABLE campaign
  ADD COLUMN campaign_type varchar(30) NULL COMMENT '活动类型' AFTER title,
  ADD COLUMN target_count int NULL COMMENT '目标人数' AFTER campaign_type,
  ADD COLUMN location varchar(120) NULL COMMENT '活动地点' AFTER target_count,
  ADD COLUMN requirement text NULL COMMENT '参与要求' AFTER description;
