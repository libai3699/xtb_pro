ALTER TABLE `app_user`
  ADD COLUMN `account` varchar(50) NULL AFTER `role`,
  ADD COLUMN `password` varchar(255) NULL AFTER `account`,
  ADD UNIQUE KEY `uk_app_user_account` (`account`);
