import React, { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Fade,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

const generateDiscountCode = (prefix = 'APEX') => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${randomPart}`;
};

const DiscountWidget = () => {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const navigate = useNavigate();
  const { discountConfig, addDiscountLead, addContactRequest } = useApp() || {};

  // If admin disables the discount coupon, don't show the widget
  if (discountConfig && discountConfig.isEnabled === false) {
    return null;
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePhoneChange = (e) => {
    // Digits only, max 10 chars
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const prefix = discountConfig?.codePrefix || 'APEX';
    const newCode = generateDiscountCode(prefix);
    setDiscountCode(newCode);
    setIsSubmitted(true);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E11D48', '#10B981', '#F43F5E', '#F59E0B'],
      });
    } catch (err) {
      // Ignore if confetti fails
    }

    // Save lead in AppContext & localStorage
    if (typeof addDiscountLead === 'function') {
      addDiscountLead({
        phone: `+91 ${phone}`,
        code: newCode,
        discount: discountConfig?.discountPercentage || '20% OFF',
      });
    }

    if (typeof addContactRequest === 'function') {
      addContactRequest({
        name: `Discount Lead (${phone})`,
        email: 'N/A',
        phone: `+91 ${phone}`,
        subject: `Claimed ${discountConfig?.discountPercentage || '20%'} Code: ${newCode}`,
        message: `Patient requested discount coupon ${newCode} via left floating tab.`,
      });
    }
  };

  const handleCopyCode = () => {
    if (!discountCode) return;
    navigator.clipboard.writeText(discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleBookNow = () => {
    handleClose();
    // Copy code automatically so patient can paste it
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
    }
    navigate('/book-appointment', { state: { promoCode: discountCode } });
  };

  return (
    <>
      {/* 1. DISMISSED / MINIMIZED FLOATING ICON (TINY 32px DOT) */}
      {isDismissed ? (
        <Tooltip title={`Get ${discountConfig?.discountPercentage || '20%'} Discount`} placement="right">
          <Box
            onClick={() => {
              setIsDismissed(false);
              handleOpen();
            }}
            role="button"
            tabIndex={0}
            aria-label="Open Discount"
            sx={{
              position: 'fixed',
              bottom: { xs: 84, md: 'auto' },
              left: { xs: 20, md: 0 },
              top: { xs: 'auto', md: '72%' },
              transform: { xs: 'none', md: 'translateY(-50%)' },
              zIndex: 1250,
              cursor: 'pointer',
              width: { xs: 34, md: 30 },
              height: { xs: 34, md: 30 },
              borderRadius: { xs: '50%', md: '0 10px 10px 0' },
              bgcolor: '#E11D48',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.45)',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: { xs: 'scale(1.12)', md: 'translateY(-50%) scale(1.12)' },
                bgcolor: '#BE123C',
              },
            }}
          >
            🎁
          </Box>
        </Tooltip>
      ) : (
        <>
          {/* 2. MOBILE VIEW: SLEEK HORIZONTAL MINI-PILL (Docked cleanly above WhatsApp, ZERO text overlap) */}
          <Box
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label="Get 20% Discount"
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'fixed',
              left: 20,
              bottom: 84,
              zIndex: 1250,
              cursor: 'pointer',
              bgcolor: '#BE123C',
              background: 'linear-gradient(135deg, #BE123C 0%, #E11D48 100%)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              boxShadow: '0 4px 16px rgba(225, 29, 72, 0.4)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              py: 0.5,
              px: 1.4,
              alignItems: 'center',
              gap: 0.8,
              transition: 'all 0.2s ease',
              userSelect: 'none',
              '&:hover': {
                bgcolor: '#9F1239',
                transform: 'scale(1.04)',
              },
            }}
          >
            <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>🎁</span>
            <Typography sx={{ fontWeight: 800, fontSize: '0.74rem', letterSpacing: '0.04em', color: '#FFFFFF' }}>
              {discountConfig?.discountPercentage || '20% OFF'}
            </Typography>
            {/* Quick Dismiss 'x' button */}
            <Box
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              sx={{
                ml: 0.4,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.45)' },
              }}
            >
              ✕
            </Box>
          </Box>

          {/* 3. DESKTOP VIEW: ULTRA-SLIM, COMPACT TAB (Positioned lower at 72% so it never blocks text) */}
          <Box
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label="Get 20% Discount"
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'fixed',
              left: 0,
              top: '72%',
              transform: 'translateY(-50%)',
              zIndex: 1250,
              cursor: 'pointer',
              bgcolor: '#FFFFFF',
              border: '1.5px solid #E11D48',
              borderLeft: 'none',
              borderRadius: '0 12px 12px 0',
              boxShadow: '0 6px 20px rgba(10, 37, 64, 0.15)',
              py: 1.2,
              px: 0.6,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              userSelect: 'none',
              '&:hover': {
                bgcolor: '#fce5e5',
                transform: 'translateY(-50%) translateX(3px)',
                boxShadow: '0 10px 25px rgba(225, 29, 72, 0.25)',
              },
            }}
          >
            {/* Tiny dismiss button at top of tab */}
            <Box
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              title="Hide discount tab"
              sx={{
                width: 14,
                height: 14,
                mb: 0.6,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                bgcolor: '#E2E8F0',
                color: '#64748B',
                fontSize: '0.6rem',
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#CBD5E1', color: '#0F172A' },
              }}
            >
              ✕
            </Box>

            {/* Vertical Text (Ultra-compact & elegant) */}
            <Typography
              sx={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                transform: 'rotate(180deg)',
                fontWeight: 900,
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                color: '#E11D48',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span>{discountConfig?.discountPercentage ? `${discountConfig.discountPercentage} OFF` : '20% OFF'}</span>
            </Typography>

            {/* Small Gift Emoji */}
            <Box sx={{ mt: 0.8, fontSize: '0.95rem', lineHeight: 1 }}>
              🎁
            </Box>
          </Box>
        </>
      )}

      {/* Popup Modal Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        transitionDuration={300}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: { xs: 2.5, sm: 3.5 },
            boxShadow: '0 25px 60px -15px rgba(10, 37, 64, 0.25)',
            position: 'relative',
          },
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            color: '#64748B',
            bgcolor: '#F1F5F9',
            '&:hover': { bgcolor: '#E2E8F0', color: '#0F172A' },
            width: 34,
            height: 34,
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <DialogContent sx={{ p: 0, pt: 1 }}>
          {!isSubmitted ? (
            /* STEP 1: FORM VIEW (Phone Number Only) */
            <Box component="form" onSubmit={handleSubmit}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 2.5, px: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0A2540', mb: 0.8, fontSize: '1.45rem' }}>
                  Get Your Discount Code!
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.45 }}>
                  Enter your phone number to receive an exclusive discount code
                </Typography>
              </Box>

              {/* 20% OFF Offer Box */}
              <Box
                sx={{
                  bgcolor: '#FFF1F2',
                  border: '1.5px solid #FECDD3',
                  borderRadius: '16px',
                  p: 2.2,
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: '#E11D48',
                    fontSize: '2.2rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    mb: 0.4,
                  }}
                >
                  {discountConfig?.discountHeadline || '20% OFF'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: '#BE123C',
                    fontSize: '0.86rem',
                  }}
                >
                  {discountConfig?.discountSubtext || 'Exclusive discount for new patients!'}
                </Typography>
              </Box>

              {/* Phone Input with +91 Country Adornment */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block', mb: 0.8 }}>
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={handlePhoneChange}
                  error={Boolean(error)}
                  helperText={error}
                  required
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.8,
                            pr: 1.2,
                            borderRight: '1px solid #CBD5E1',
                          }}
                        >
                          <span role="img" aria-label="India Flag" style={{ fontSize: '1.1rem' }}>
                            🇮🇳
                          </span>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>
                            +91
                          </Typography>
                        </Box>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      bgcolor: '#FFFFFF',
                      '& input': { py: 1.5 },
                    },
                  }}
                />
              </Box>

              {/* Submit CTA */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.6,
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  bgcolor: '#E11D48',
                  boxShadow: '0 8px 20px rgba(225, 29, 72, 0.35)',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#BE123C',
                    boxShadow: '0 10px 25px rgba(190, 18, 60, 0.45)',
                  },
                }}
              >
                Get My Discount Code
              </Button>
            </Box>
          ) : (
            /* STEP 2: SUCCESS VIEW (Display Code) */
            <Box sx={{ textAlign: 'center', py: 1 }}>
              {/* Crimson Check Circle */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: '#FFE4E6',
                  color: '#E11D48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2.2,
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 44 }} />
              </Box>

              {/* Heading */}
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0A2540', mb: 2.5, fontSize: '1.65rem' }}>
                Your Discount Code
              </Typography>

              {/* Exclusive Code Container */}
              <Box
                sx={{
                  bgcolor: '#FFF1F2',
                  border: '1.5px solid #FECDD3',
                  borderRadius: '18px',
                  p: 3,
                  mb: 3,
                  position: 'relative',
                }}
              >
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, display: 'block', mb: 1 }}>
                  Your exclusive code:
                </Typography>

                {/* Big Bold Code with Copy Action */}
                <Box
                  onClick={handleCopyCode}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    py: 0.5,
                    px: 1.5,
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.08)' },
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: '#E11D48',
                      letterSpacing: '0.08em',
                      fontSize: { xs: '1.8rem', sm: '2.1rem' },
                    }}
                  >
                    {discountCode}
                  </Typography>
                  <Tooltip title={copied ? 'Copied!' : 'Copy Code'}>
                    <IconButton size="small" sx={{ color: copied ? '#10B981' : '#E11D48' }}>
                      {copied ? <CheckIcon sx={{ fontSize: 20 }} /> : <ContentCopyIcon sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </Tooltip>
                </Box>

                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 700, mt: 1.2 }}>
                  {discountConfig?.discountPercentage || '20%'} off your first appointment
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.3 }}>
                  Valid for {discountConfig?.validityDays || 10} days
                </Typography>
              </Box>

              {/* Book Appointment CTA */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBookNow}
                startIcon={<CalendarMonthIcon />}
                sx={{
                  py: 1.6,
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  bgcolor: '#E11D48',
                  boxShadow: '0 8px 20px rgba(225, 29, 72, 0.35)',
                  textTransform: 'none',
                  mb: 1.5,
                  '&:hover': {
                    bgcolor: '#BE123C',
                    boxShadow: '0 10px 25px rgba(190, 18, 60, 0.45)',
                  },
                }}
              >
                Book Your Appointment
              </Button>

              {/* Close text button */}
              <Button
                onClick={handleClose}
                sx={{
                  color: '#64748B',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { color: '#0F172A', bgcolor: 'transparent' },
                }}
              >
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiscountWidget;
