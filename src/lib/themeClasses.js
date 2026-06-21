/** Returns theme-dependent class strings based on darkMode boolean */
export function getTheme(d) {
  return {
    bg:         d ? 'bg-[#0d0d1a]'      : 'bg-gray-100',
    card:       d ? 'bg-[#16162a]'      : 'bg-white',
    cardInner:  d ? 'bg-[#0d0d1a]'     : 'bg-gray-50',
    border:     d ? 'border-[#2a2a4a]' : 'border-gray-200',
    borderInput:d ? 'border-[#3a3a6a]' : 'border-gray-300',
    heading:    d ? 'text-white'        : 'text-gray-900',
    subtext:    d ? 'text-gray-400'     : 'text-gray-500',
    muted:      d ? 'text-gray-500'     : 'text-gray-400',
    inputText:  d ? 'text-gray-300'     : 'text-gray-800',
    navBg:      d ? 'bg-[#12121f]'      : 'bg-white',
    divider:    d ? 'bg-[#2a2a4a]'      : 'bg-gray-200',
  };
}