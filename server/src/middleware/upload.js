'use strict';

const path = require('path');
const multer = require('multer');

// ─── Constants ───────────────────────────────────────────────────────────────

const AVATAR_DIR    = path.join(__dirname, '../../uploads/avatars');
const CATEGORY_DIR  = path.join(__dirname, '../../uploads/categories');
const AUCTION_DIR   = path.join(__dirname, '../../uploads/auctions');
const COVER_DIR     = path.join(__dirname, '../../uploads/covers');

const MAX_SIZE_MB        = 2;          // avatars & category images
const AUCTION_MAX_MB     = 5;          // auction images — higher limit
const MAX_SIZE_B         = MAX_SIZE_MB   * 1024 * 1024;
const AUCTION_MAX_SIZE_B = AUCTION_MAX_MB * 1024 * 1024;
const ALLOWED_MIME  = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT   = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Keep old name as alias so existing code is not broken
const UPLOAD_DIR = AVATAR_DIR;

// ─── Storage factory ─────────────────────────────────────────────────────────

function makeStorage(destDir) {
  return multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, destDir);
    },
    filename(_req, file, cb) {
      // <timestamp>-<random>.<ext>  — no spaces, no user-supplied names
      const ext  = path.extname(file.originalname).toLowerCase();
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });
}

// ─── Storage ─────────────────────────────────────────────────────────────────

const storage = makeStorage(UPLOAD_DIR);

// ─── File filter ─────────────────────────────────────────────────────────────

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(
      Object.assign(new Error('Only JPEG, PNG, and WebP images are allowed'), {
        statusCode: 422,
      })
    );
  }
  cb(null, true);
}

// ─── Multer instances ─────────────────────────────────────────────────────────

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_B, files: 1 },
});

const uploadCategory = multer({
  storage: makeStorage(CATEGORY_DIR),
  fileFilter,
  limits: { fileSize: MAX_SIZE_B, files: 1 },
});

const uploadCover = multer({
  storage: makeStorage(COVER_DIR),
  fileFilter,
  limits: { fileSize: MAX_SIZE_B, files: 1 },
});

const uploadAuction = multer({
  storage: makeStorage(AUCTION_DIR),
  fileFilter,
  limits: {
    fileSize: AUCTION_MAX_SIZE_B,  // 5 MB per image
    files: 8,                       // max 8 images per auction
  },
});

// ─── Named middleware ─────────────────────────────────────────────────────────

/**
 * Shared multer error normaliser.
 */
function handleMulterError(err, next) {
  if (err.constructor.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? `Image must be ${MAX_SIZE_MB} MB or smaller`
        : err.message;
    const error = new Error(message);
    error.statusCode = 422;
    return next(error);
  }
  next(err);
}

/**
 * uploadAvatar – processes a single file from the `avatar` form field.
 * Wraps multer so its errors are converted to standard Express errors with
 * the correct statusCode before reaching the global error handler.
 *
 * Usage:  router.post('/avatar', authenticate, uploadAvatar, controller)
 */
function uploadAvatar(req, res, next) {
  upload.single('avatar')(req, res, (err) => {
    if (!err) return next();
    handleMulterError(err, next);
  });
}

/**
 * uploadCategoryImage – processes a single file from the `image` form field.
 * Saves to uploads/categories/. Same validation rules as uploadAvatar.
 *
 * Usage:  router.post('/:id/image', authenticate, authorize('admin'), uploadCategoryImage, controller)
 */
function uploadCategoryImage(req, res, next) {
  uploadCategory.single('image')(req, res, (err) => {
    if (!err) return next();
    handleMulterError(err, next);
  });
}

/**
 * uploadCoverImage – processes a single file from the `cover` form field.
 * Saves to uploads/covers/. Same validation rules as uploadAvatar.
 *
 * Usage:  router.post('/cover', authenticate, uploadCoverImage, controller)
 */
function uploadCoverImage(req, res, next) {
  uploadCover.single('cover')(req, res, (err) => {
    if (!err) return next();
    handleMulterError(err, next);
  });
}

/**
 * uploadAuctionImages – processes up to 8 files from the `images` form field.
 * Saves to uploads/auctions/. Each file max 5 MB.
 *
 * Usage:  router.post('/:id/images', authenticate, authorize('seller'), uploadAuctionImages, controller)
 */
function uploadAuctionImages(req, res, next) {
  uploadAuction.array('images', 8)(req, res, (err) => {
    if (!err) return next();
    if (err.constructor.name === 'MulterError') {
      const message =
        err.code === 'LIMIT_FILE_SIZE'
          ? `Each image must be ${AUCTION_MAX_MB} MB or smaller`
          : err.code === 'LIMIT_FILE_COUNT'
          ? 'Maximum 8 images per auction'
          : err.message;
      const error = new Error(message);
      error.statusCode = 422;
      return next(error);
    }
    next(err);
  });
}

module.exports = { uploadAvatar, uploadCoverImage, uploadCategoryImage, uploadAuctionImages };
