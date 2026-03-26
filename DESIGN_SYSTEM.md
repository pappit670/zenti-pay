# Zenti Smart Pay - UI/UX Design System

## Brand Identity

**Zenti** is a modern fintech payment platform focused on simplicity, security, and accessibility. The design language balances premium aesthetics with approachability, using a sophisticated dark-first approach with vibrant accents.

**Tagline:** "Money Made Simple"

---

## Color Palette

### Primary Colors
- **Black/Dark**: `#000000` - Primary background, strength, security
- **White**: `#ffffff` - Text, accents, clarity
- **Premium Green**: `#a3f542` - Primary action, highlights, premium badge

### Secondary Colors
- **Dark Gray**: `#2a2a2a` - Card backgrounds, subtle surfaces
- **Medium Gray**: `#3a3a3a` - Borders, secondary backgrounds
- **Light Gray**: `#666666` - Secondary text, disabled states
- **Lightest Gray**: `#999999` - Tertiary text, hints

### Functional Colors
- **Success Green**: `#00cc66` - Confirmations, active states
- **Error Red**: `#ff4444` - Errors, warnings, destructive actions
- **Warning Orange**: `#ff9500` - Caution states
- **Info Blue**: `#00d4ff` - Information messages
- **Gold**: `#ffd700` - Premium features, ratings

### Semantic Colors
```
Background:     #000000 (dark mode) | #ffffff (light mode)
Surface:        #2a2a2a (dark) | #f5f5f5 (light)
Text Primary:   #ffffff (dark) | #000000 (light)
Text Secondary: #999999 (dark) | #666666 (light)
Border:         rgba(255,255,255,0.1) (dark) | rgba(0,0,0,0.1) (light)
Overlay:        rgba(0,0,0,0.8) (dark) | rgba(0,0,0,0.5) (light)
```

### Gradient Applications
```typescript
// Premium Gradient (Glass effect)
colors={['#1a1a1a', '#000000', '#1a1a1a']}

// Success Gradient
colors={['#00cc66', '#00aa55']}

// Error Gradient
colors={['#ff4444', '#dd3333']}

// Accent Gradient
colors={['#a3f542', '#88cc22']}
```

---

## Typography

### Font Family
- **Primary**: System fonts (React Native defaults)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Type Hierarchy

| Component | Size | Weight | Line Height | Usage |
|-----------|------|--------|-------------|-------|
| Display 1 | 32px | 300 | 40px | Main titles, welcome screen |
| Display 2 | 28px | 300-400 | 36px | Section titles, headers |
| Heading 1 | 24px | 500-600 | 32px | Page titles, modal headers |
| Heading 2 | 20px | 600 | 28px | Section titles |
| Body Large | 18px | 400-500 | 27px | Large body text |
| Body Normal | 16px | 400 | 24px | Standard body text |
| Body Small | 14px | 400 | 21px | Secondary text |
| Label | 12px | 500 | 18px | Labels, badges, tags |
| Caption | 12px | 300 | 18px | Hints, meta information |

### Text Color Usage
- **Primary text**: `#ffffff` (dark mode) - Main body, headers
- **Secondary text**: `#999999` (dark mode) - Supporting info
- **Tertiary text**: `#666666` (dark mode) - Hints, disabled
- **Accent text**: `#a3f542` - Important highlights
- **Error text**: `#ff4444` - Errors, alerts
- **Success text**: `#00cc66` - Confirmations

---

## Spacing System (8px Grid)

```
xs: 4px      (minimal spacing)
sm: 8px      (small gaps)
md: 16px     (standard padding)
lg: 24px     (section spacing)
xl: 32px     (large sections)
xxl: 48px    (major sections)
```

### Common Spacing Values
```typescript
Padding: 16px (inner), 24px (edges)
Margin: 8px (between items), 16px (between sections), 24px (major sections)
Gap: 8px (horizontal), 12px (vertical)
Border Radius: 12px (small), 16px (medium), 20px (large), 32px (extra-large)
```

---

## Component Design

### Buttons

#### Primary Button
```typescript
{
  backgroundColor: '#000000',
  borderColor: '#ffffff',
  borderWidth: 1,
  borderRadius: 16,
  paddingVertical: 18,
  paddingHorizontal: 32,
  // Text: white, 16px, semibold
}
```
**States:**
- Default: Black border, white text
- Hover: Slightly lighter border
- Active: Filled with white, black text
- Disabled: 50% opacity

#### Secondary Button
```typescript
{
  backgroundColor: 'transparent',
  borderColor: 'rgba(255,255,255,0.3)',
  borderWidth: 1,
  borderRadius: 16,
  paddingVertical: 18,
  // Text: white, 16px, 300 weight
}
```

#### Action Button (Compact)
```typescript
{
  backgroundColor: '#a3f542',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 24,
  // Text: black, 14px, 600 weight
}
```

#### Icon Button
```typescript
{
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#3a3a3a',
  justifyContent: 'center',
  alignItems: 'center',
}
```
**Icon color:** White text, green for active

#### Danger Button
```typescript
{
  backgroundColor: '#ff4444',
  borderRadius: 12,
  paddingVertical: 14,
  // Text: white, 16px, 600 weight
}
```

### Cards

#### Standard Card
```typescript
{
  backgroundColor: '#2a2a2a',
  borderRadius: 20,
  padding: 24,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  // Shadow/elevation on native
}
```

#### Glass Card (Frosted)
```typescript
{
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: 32,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  // Use with BlurView for effect
}
```

#### Transaction Card
```typescript
{
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  padding: 16,
  backgroundColor: '#2a2a2a',
  borderRadius: 16,
  marginBottom: 8,
}
```

### Input Fields

#### Text Input
```typescript
{
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  paddingVertical: 16,
  paddingHorizontal: 20,
  color: '#ffffff',
  fontSize: 16,
}
```

**States:**
- Default: Light gray border
- Focused: `borderColor: 'rgba(255,255,255,0.3)'`
- Error: `borderColor: '#ff4444'`
- Disabled: `opacity: 0.5`

#### Dropdown
```typescript
{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'rgba(255,255,255,0.08)',
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 20,
}
```

### Badges

#### Premium Badge
```typescript
{
  backgroundColor: '#a3f542',
  borderRadius: 12,
  paddingVertical: 6,
  paddingHorizontal: 16,
  // Text: black, 12px, bold
}
```

#### Status Badge
```typescript
{
  borderRadius: 20,
  paddingVertical: 4,
  paddingHorizontal: 12,
  // Color varies: green (#00cc66), red (#ff4444), orange (#ff9500)
  // Text: white, 12px, 500 weight
}
```

### Navigation Bar

#### Tab Bar
```typescript
{
  backgroundColor: '#000000',
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.1)',
  height: 80,
  // 5 tabs: Home, Wallet, Pay, Stats, Settings
}
```

**Tab Icon States:**
- Active: Green `#a3f542`, larger
- Inactive: Gray `#666666`, smaller
- Transition: Smooth animation

#### Menu Item
```typescript
{
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  padding: 16,
  backgroundColor: '#2a2a2a',
  borderRadius: 12,
  marginBottom: 8,
}
```

---

## Layout & Visual Hierarchy

### Screen Structure
```
┌─────────────────────────────┐
│  Safe Area (60px top)       │
├─────────────────────────────┤
│  Header / Title             │  (24px vertical padding)
├─────────────────────────────┤
│                             │
│  Main Content (Scrollable)  │  (24px horizontal padding)
│                             │
├─────────────────────────────┤
│  CTAs / Footer              │  (24px padding + 40px safe)
└─────────────────────────────┘
```

### Spacing Rules
- **Top padding**: 60px (safe area) + 24px (content)
- **Horizontal padding**: 24px on mobile, 32px on larger screens
- **Between sections**: 24px vertical gap
- **Between items**: 8-12px vertical gap
- **Bottom padding**: 24px + safe area (40px)

### Card Layouts

#### Full Width
```
| Padding 24px | Content | Padding 24px |
```

#### Two Column
```
Padding 24px | Item | Gap 8px | Item | Padding 24px
(width: (width - padding - gap) / 2)
```

#### Three Column
```
Padding 24px | Item | Gap 8px | Item | Gap 8px | Item | Padding 24px
(width: (width - padding - gap*2) / 3)
```

---

## Dark Mode Design

### Design Principles
- **Contrast**: Maintain WCAG AA minimum 4.5:1 for text
- **Reduce eye strain**: Subtle backgrounds, not pure black
- **Accent visibility**: Green (#a3f542) pops against dark backgrounds
- **Hierarchy**: Use opacity and color shifts for depth

### Dark Mode Values
```typescript
const darkColors = {
  background: '#000000',
  surface: '#2a2a2a',
  surfaceAlt: '#1a1a1a',
  border: 'rgba(255,255,255,0.1)',
  text: '#ffffff',
  textSecondary: '#999999',
  textTertiary: '#666666',
  accentGreen: '#a3f542',
  successGreen: '#00cc66',
  errorRed: '#ff4444',
  warningOrange: '#ff9500',
  infoBlue: '#00d4ff',
};
```

### Dark Mode Guidelines
- Text should be `#ffffff` or `#999999`, never lighter
- Cards use `#2a2a2a` with subtle borders
- Avoid pure black text on light backgrounds in dark mode
- Use green accents sparingly for important CTAs only

---

## Light Mode Design

### Light Mode Values
```typescript
const lightColors = {
  background: '#ffffff',
  surface: '#f5f5f5',
  surfaceAlt: '#eeeeee',
  border: 'rgba(0,0,0,0.1)',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  accentGreen: '#a3f542',
  successGreen: '#00cc66',
  errorRed: '#ff4444',
  warningOrange: '#ff9500',
  infoBlue: '#0066ff',
};
```

### Light Mode Guidelines
- Sufficient contrast for all text
- Use soft shadows instead of borders for depth
- Reduce opacity of borders (more subtle)
- Keep green accents consistent

---

## Interactive Patterns

### Button Feedback
```typescript
opacity: 0.7          // On press
scale: 0.98           // Slightly smaller on press
haptics.impactAsync() // Haptic feedback (native only)
```

### Transitions
```typescript
duration: 200-300ms   // Standard transitions
timing: 'ease-out'    // Natural movement
```

### Loading States
```typescript
opacity: 0.5
// Show spinner or skeleton
disabled: true
```

### Error Feedback
```typescript
borderColor: '#ff4444'
backgroundColor: 'rgba(255,68,68,0.1)'
// Show error message below
```

### Success Feedback
```typescript
borderColor: '#00cc66'
// Green checkmark animation
// Toast notification (optional)
```

---

## Modal & Overlay Design

### Modal Content
```typescript
{
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: 24,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.1)',
  // With BlurView background
}
```

### Modal Overlay
```typescript
backgroundColor: 'rgba(0,0,0,0.8)'  // Dark overlay
// Dismiss on outside tap
```

### Bottom Sheet
```typescript
backgroundColor: '#2a2a2a'
borderTopLeftRadius: 24
borderTopRightRadius: 24
```

---

## Glass Morphism Effects

### Frosted Glass
```typescript
// Requires BlurView component
<BlurView intensity={20} tint="dark">
  <View style={{
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  }} />
</BlurView>
```

### Usage
- Authentication screens
- Premium features
- Modal dialogs
- Overlay components

---

## Accessibility

### Color Contrast
- Text on background: 4.5:1 minimum (AA standard)
- Text on colored backgrounds: 3:1 minimum
- Interactive elements: Clearly distinguishable

### Touch Targets
- Minimum: 44x44 points
- Recommended: 48x48 points
- Spacing: 8px minimum between targets

### Text Readability
- Line height: 150% for body, 120% for headings
- Maximum line length: 640px
- Letter spacing: normal to 1.5px for headings

### ARIA & Semantic
- Use `accessibilityLabel` for icons
- Use `accessibilityRole` for components
- Use `accessibilityHint` for complex interactions

---

## Animations & Micro-interactions

### Page Transitions
```typescript
// Slide in from right
duration: 300
// Fade in/out
opacity: 0 → 1
```

### Button Interactions
```typescript
// Scale down on press
scale: 1.0 → 0.98
// Fade in background
opacity: 0 → 0.1
```

### List Animations
```typescript
// Stagger children
delay: index * 50ms
opacity: 0 → 1
transform: translateY(10px) → translateY(0)
```

### Loading Spinners
```typescript
// Rotating animation
rotation: 0 → 360°
duration: 1000ms
loop: true
```

---

## Icon Usage

### Icon Library
- **lucide-react-native** for all icons
- Size: 20px (default), 24px (large), 16px (small)
- Color: `currentColor` (inherits from text color)
- Stroke width: 2px (default)

### Common Icons
```
Send:          Send, ArrowRight
Request:       Download, ArrowLeft
Wallet:        Wallet, CreditCard
Pay:           DollarSign, TrendingUp
Settings:      Settings, Sliders
User:          User, UserCheck
Business:      Briefcase, Building2
Security:      Lock, Shield, Eye, EyeOff
Theme:         Sun, Moon
Menu:          Menu, MoreVertical, ChevronRight
Status:        CheckCircle, AlertCircle, XCircle
```

---

## Responsive Design

### Breakpoints
```
Mobile:   < 480px   (phones)
Tablet:   480-768px (tablets)
Desktop:  > 768px   (web/large screens)
```

### Layout Adjustments
| Breakpoint | Padding | Gap | Card Width |
|-----------|---------|-----|-----------|
| Mobile | 24px | 8px | Full width - 48px |
| Tablet | 32px | 12px | Flexible grid |
| Desktop | 40px | 16px | Max 1000px |

---

## Payment UI Patterns

### Amount Entry
```
Display: Center-aligned, large font (32px)
Format: Localized currency (USD, etc)
Input: Decimal pad + backspace
Feedback: Real-time validation
```

### Transaction Confirmation
```
Summary: Large amount, recipient, fee
CTA: Prominent "Confirm" button
Cancel: Secondary "Back" button
Status: Loading spinner during processing
```

### Success State
```
Icon: Checkmark animation
Message: "Transfer complete"
Details: Transaction ID, time
CTA: "Done" or "Share"
```

### Error State
```
Icon: Alert triangle, red color
Message: Clear error explanation
CTA: "Retry" or "Go back"
Help: Support link or error code
```

---

## Form Patterns

### Input Groups
```
Label (12px, gray)
Input field
Error message (12px, red) - if error
Help text (12px, gray) - if needed
Spacing: 8px between elements
```

### Form Layout
```
Vertical stack
Gap: 16px between fields
Button: Full width at bottom
Validation: Real-time feedback
```

### Multi-step Forms
```
Progress indicator at top
Step number badge
Back / Next buttons
Save progress indication
```

---

## Brand Voice in UI

### Microcopy
- **Clear & direct**: "Send $50 to John"
- **Friendly & modern**: "Money made simple"
- **Action-oriented**: "Confirm transfer" not "Process"
- **Error-specific**: "Email already in use" not "Error"

### Loading States
- "Processing your payment..."
- "Securing your transaction..."
- "Just a moment..."

### Success Messages
- "Sent successfully!"
- "Payment received"
- "Transfer complete"

### Error Messages
- Clear explanation
- Actionable next step
- Support contact if needed

---

## Quality Standards

### Pixel Perfection
- All spacing follows 8px grid
- Borders: 1px (crisp on displays)
- Border radius: Consistent per component type
- Alignment: Perfect to grid

### Consistency
- Same button style across all screens
- Consistent card styling
- Unified spacing patterns
- Color usage matches guidelines

### Performance
- Minimal animations (smooth 60fps)
- Optimized image sizes
- Lazy loading for lists
- Smooth scrolling

---

## Design Resources

### Colors (Copy-paste)
```typescript
// Zenti Colors
const colors = {
  black: '#000000',
  white: '#ffffff',
  greenPrimary: '#a3f542',
  greenSuccess: '#00cc66',
  red: '#ff4444',
  orange: '#ff9500',
  blue: '#00d4ff',
  gold: '#ffd700',
  darkGray: '#2a2a2a',
  mediumGray: '#3a3a3a',
  lightGray: '#666666',
  lighterGray: '#999999',
};
```

### Spacing (Copy-paste)
```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
```

### Typography (Copy-paste)
```typescript
const typography = {
  display1: { fontSize: 32, fontWeight: '300', lineHeight: 40 },
  display2: { fontSize: 28, fontWeight: '300', lineHeight: 36 },
  h1: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  bodyLarge: { fontSize: 18, fontWeight: '400', lineHeight: 27 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
  label: { fontSize: 12, fontWeight: '500', lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '300', lineHeight: 18 },
};
```

---

This design system ensures consistency, accessibility, and a premium user experience across all Zenti screens.
