'use client';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import InstagramIcon from '@mui/icons-material/Instagram';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
/*
 * CONEXIÓN PENDIENTE — Botón flotante de Instagram
 * Usa publicContact.socials.instagram y publicContact.instagramHandle.
 * Si socialInstagramUrl está vacío, el componente ya retorna null (no aparece).
 * Una vez conectado el backend, estos valores vienen de:
 *   GET /datosEmpresa/seleccionarDatosEmpresa → d.socialInstagramUrl, d.socialInstagramHandle
 */
import { publicContact } from "@/lib/publicContact";

export default function FloatingActionButtonExtendedSize() {
  const [open, setOpen] = useState(true);

  // Nota: Si se cierra de inmediato, probablemente existe la bandera en sessionStorage de una prueba anterior.
  // Solución rápida en desarrollo: borra la clave en la consola: sessionStorage.removeItem('ig_banner_dismissed_v2');
  useEffect(() => {
    const dismissed = typeof window !== 'undefined' && sessionStorage.getItem('ig_banner_dismissed_v2') === '1';
    if (dismissed) setOpen(false);
  }, []);

  if (!open) return null;
  if (!publicContact.socials.instagram) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: { xs: 1, md: 1.5 },
        py: { xs: 0.8, md: 1 },
        borderRadius: '9999px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
        background: 'linear-gradient(90deg, #4C2FE3 0%, #6834E3 20%, #9B2BD1 45%, #E02A6A 70%, #FF3B30 100%)',
        color: '#fff',
        backdropFilter: 'saturate(120%)',
      }}
    >
      {/* Icono con fondo estilo Instagram */}
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          borderRadius: '16px',
          p: 0.5,
          width: 20,
          height: 20,
          background:
            'linear-gradient(135deg,#F58529 0%,#FEDA77 25%,#DD2A7B 50%,#8134AF 75%,#515BD4 100%)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          mr: 1,
        }}
      >
        <InstagramIcon sx={{ fontSize: 20, color: '#fff' }} />
      </Box>

      {/* Texto y enlace */}
      <Link
        href={publicContact.socials.instagram}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        color="inherit"
        sx={{
          display: 'block',
          flex: 1,
          cursor: 'pointer',
          '&:hover': { opacity: 0.95 },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: { xs: 12, md: 14 },
            letterSpacing: 0.2,
            mr: 1,
          }}
        >
          Síguenos en Instagram
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: { xs: 12, md: 14 } }}
        >
          {` ${publicContact.instagramHandle || ""}`}
        </Typography>
      </Link>

      {/* Botón cerrar */}
      <IconButton
        aria-label="Cerrar"
        onClick={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('ig_banner_dismissed_v2', '1');
          }
          setOpen(false);
        }}
        sx={{
          color: '#fff',
          ml: 1,
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
        }}
        size="large"
      >
        <CloseRoundedIcon sx={{ fontSize: { xs: 18, md: 22 } }} />
      </IconButton>
    </Box>
  );
}
