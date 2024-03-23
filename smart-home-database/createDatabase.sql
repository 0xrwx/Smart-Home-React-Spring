CREATE TABLE `houses`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `owner_id` BIGINT UNSIGNED NOT NULL,
    `address_name` VARCHAR(255) NOT NULL
);
CREATE TABLE `rooms`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `brightness` DOUBLE(8, 2) NOT NULL,
    `light` BOOLEAN NOT NULL,
    `temperature` DOUBLE(8, 2) NOT NULL,
    `house_id` BIGINT UNSIGNED NOT NULL
);
CREATE TABLE `users`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `houses` ADD CONSTRAINT `houses_owner_id_foreign` FOREIGN KEY(`owner_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `rooms` ADD CONSTRAINT `rooms_house_id_foreign` FOREIGN KEY(`house_id`) REFERENCES `houses`(`id`);