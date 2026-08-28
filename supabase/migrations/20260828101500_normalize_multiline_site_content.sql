update public.site_settings
set brands_text = replace(brands_text, E'\\n', E'\n'),
    why_us_text = replace(why_us_text, E'\\n', E'\n')
where id = 1;

alter table public.site_settings
  alter column brands_text set default E'⭐ Rapid\n⭐ Piva\nJohn Deere\nFendt\nCase IH\nNew Holland\nMassey Ferguson\nDeutz-Fahr\nClaas\nSame\nHusqvarna\nStihl',
  alter column why_us_text set default E'trophy|+20 años de experiencia|Décadas de trabajo con toda clase de maquinaria agrícola en Cantabria y alrededores.\nmicroscope|Diagnóstico avanzado|Herramientas de última generación para un diagnóstico preciso.\nzap|Servicio urgente|Atendemos urgencias con la mayor rapidez posible.\ncheck-circle|Garantía en reparaciones|Todos nuestros trabajos llevan garantía.';
