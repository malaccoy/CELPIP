# CELPIP Design System

Este documento define o padrão visual do CELPIP Coach. Use como referência para qualquer nova página ou componente.

## 🎨 Filosofia

- **Dark-first**: Background escuro com elementos claros
- **Premium feel**: Transições suaves, sombras com profundidade, micro-interações
- **Mobile-first**: Tudo deve funcionar bem em telas pequenas
- **Sem "AI slop"**: Evitar gradientes roxos genéricos, Inter/Roboto, layouts cookie-cutter

---

## 🎯 Cores

### Backgrounds
```scss
// Gradiente principal (páginas dark)
background: linear-gradient(180deg, #0a0f1a 0%, #0f172a 25%, #1a1f3a 50%, #0f172a 75%, #0a0f1a 100%);

// Hero/Header sections
$gradient-hero: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #4338ca 100%);
```

### Accent Colors
```scss
// Primary (roxo/indigo)
$primary: #6366f1;
$primary-light: #818cf8;
$primary-pale: #a5b4fc;

// Success (verde)
$success: #10b981;
$success-light: #34d399;

// Warning (amarelo/laranja)
$warning: #f59e0b;

// Error (vermelho)
$error: #ef4444;
$error-light: #f87171;
```

### Gradients
```scss
$gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
$gradient-success: linear-gradient(135deg, #10b981 0%, #059669 100%);
$gradient-warning: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
```

---

## 🔤 Tipografia

### Fontes
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Uso
- **Títulos/Headings**: `font-family: 'Space Grotesk', system-ui, sans-serif;`
- **Body/UI**: `font-family: 'DM Sans', system-ui, sans-serif;`

### Hierarquia
```scss
h1 { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.03em; }
h2 { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; }
h3 { font-size: 1.1rem; font-weight: 600; letter-spacing: -0.01em; }
body { font-size: 0.9rem; line-height: 1.5; }
```

---

## ✨ Animações

### Keyframes Padrão
```scss
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.25); }
  50% { box-shadow: 0 0 35px rgba(99, 102, 241, 0.45); }
}
```

### Entrada Escalonada
```scss
// Cards aparecem um por um
.card {
  animation: fadeInUp 0.5s ease-out both;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
}
```

### Transitions
```scss
$transition-smooth: 350ms cubic-bezier(0.4, 0, 0.2, 1);
$transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🎴 Cards

### Card Padrão (Dark)
```scss
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.25rem;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }
}
```

### Card Destacado
```scss
.cardHighlight {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}
```

---

## 🔘 Botões

### Primary Button
```scss
.btnPrimary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.45);
  }
}
```

### Success Button
```scss
.btnSuccess {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
  
  &:hover {
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.45);
  }
}
```

### Ghost Button
```scss
.btnGhost {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
}
```

---

## 🌈 Ícones com Glow

```scss
.iconBox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 
    0 8px 24px rgba(16, 185, 129, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.08) rotate(-3deg);
  }
}
```

---

## 🔮 Ambient Orbs (Glow de Fundo)

```scss
// Adicionar ao container principal
.container {
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: -20%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
    pointer-events: none;
    animation: pulse 8s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 20%;
    right: -20%;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
    pointer-events: none;
    animation: pulse 10s ease-in-out infinite 2s;
  }
}
```

---

## ⚠️ O que NÃO fazer

1. **Noise textures via SVG** - Renderiza mal no mobile
2. **Fontes genéricas** - Inter, Roboto, Arial, system-ui sozinho
3. **Gradientes roxo-branco clichê** - O "AI slop" típico
4. **Hover sem feedback** - Sempre dar resposta visual
5. **Sombras flat** - Usar sempre múltiplas camadas de sombra

---

## 📱 Responsive

- Mobile-first sempre
- Cards em coluna única no mobile
- Padding reduzido: `1rem` mobile, `1.5rem+` desktop
- Border-radius menores no mobile: `16px` vs `20-24px`

---

---

## ♿ Accessibility (CRITICAL)

| Regra | Requisito |
|-------|-----------|
| `color-contrast` | Mínimo 4.5:1 para texto normal |
| `focus-states` | Focus rings visíveis em elementos interativos |
| `alt-text` | Alt text descritivo para imagens |
| `aria-labels` | aria-label para botões só com ícone |
| `keyboard-nav` | Tab order igual à ordem visual |
| `form-labels` | Label com `for` attribute |

---

## 👆 Touch & Interaction (CRITICAL)

| Regra | Requisito |
|-------|-----------|
| `touch-target-size` | Mínimo **44x44px** touch targets |
| `cursor-pointer` | Adicionar `cursor: pointer` em **todos** clickables |
| `loading-buttons` | Desabilitar botão durante operações async |
| `error-feedback` | Mensagens de erro claras perto do problema |
| `hover-feedback` | Feedback visual (cor, sombra, borda) no hover |

---

## ⚡ Performance (HIGH)

| Regra | Requisito |
|-------|-----------|
| `image-optimization` | WebP, srcset, lazy loading |
| `reduced-motion` | Checar `prefers-reduced-motion` |
| `content-jumping` | Reservar espaço para conteúdo async |
| `transform-performance` | Usar transform/opacity, não width/height |

---

## 📐 Layout & Responsive (HIGH)

| Regra | Requisito |
|-------|-----------|
| `viewport-meta` | `width=device-width initial-scale=1` |
| `readable-font-size` | Mínimo **16px** body text no mobile |
| `horizontal-scroll` | Garantir conteúdo cabe na viewport |
| `z-index-management` | Escala definida: 10, 20, 30, 50 |
| `line-length` | Limitar a 65-75 caracteres por linha |
| `line-height` | Usar 1.5-1.75 para body text |

---

## 🎭 Animation (MEDIUM)

| Regra | Requisito |
|-------|-----------|
| `duration-timing` | **150-300ms** para micro-interactions |
| `transform-performance` | Usar transform/opacity, não width/height |
| `loading-states` | Skeleton screens ou spinners |
| `stable-hover` | Usar color/opacity transitions, não scale que desloca layout |

---

## 🚫 Anti-Patterns (Evitar!)

| ❌ Don't | ✅ Do |
|---------|-------|
| Emojis como ícones (🎨 🚀 ⚙️) | SVG icons (Lucide, Heroicons) |
| Scale transforms no hover que deslocam | Color/opacity transitions |
| Cursor default em elementos clicáveis | `cursor-pointer` em tudo interativo |
| Tamanhos de ícone inconsistentes | viewBox fixo (24x24) com tamanho uniforme |
| Transições instantâneas ou >500ms | 150-300ms com easing |
| `bg-white/10` em light mode | `bg-white/80` ou mais opaco |
| Texto cinza claro em light mode | slate-900 para texto, slate-600 mínimo para muted |

---

## 🚀 Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis como ícones (usar SVG)
- [ ] Ícones do mesmo set (Lucide)
- [ ] Hover states não causam layout shift
- [ ] Cores do tema usadas diretamente

### Interaction
- [ ] Todos clickables têm `cursor-pointer`
- [ ] Hover states dão feedback visual
- [ ] Transitions suaves (150-300ms)
- [ ] Focus states visíveis para keyboard nav

### Dark Mode
- [ ] Texto com contraste suficiente (4.5:1+)
- [ ] Bordas visíveis
- [ ] Testado antes de entregar

### Layout
- [ ] Elementos fixos têm spacing das bordas
- [ ] Conteúdo não escondido atrás de navbars fixas
- [ ] Responsive em 375px, 768px, 1024px, 1440px
- [ ] Sem scroll horizontal no mobile

### Accessibility
- [ ] Todas imagens têm alt text
- [ ] Inputs têm labels
- [ ] Cor não é o único indicador
- [ ] `prefers-reduced-motion` respeitado
