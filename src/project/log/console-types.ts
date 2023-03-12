export enum ConsoleCode {
  //  ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  Reset      = '\x1b[0m',
  Bright     = '\x1b[1m',
  Dim        = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink      = '\x1b[5m',
  Reverse    = '\x1b[7m',
  Hidden     = '\x1b[8m',
  Escape     = '\x1b'
}

export enum ForegroundColor {
  // ref = 'https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797#colors--graphics-mode',
  _8_ForegroundBlack         = '\x1b[30m',
  _8_ForegroundRed           = '\x1b[31m',
  _8_ForegroundGreen         = '\x1b[32m',
  _8_ForegroundYellow        = '\x1b[33m',
  _8_ForegroundBlue          = '\x1b[34m',
  _8_ForegroundMagenta       = '\x1b[35m',
  _8_ForegroundCyan          = '\x1b[36m',//console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
  _8_ForegroundWhite         = '\x1b[37m',
  _256_ForegroundBlueish27   = '\x1b[38;5;27m',
  _256_ForegroundDullGreen29 = '\x1B[38;5;29m',
  _256_ForegroundGrayish101  = '\x1B[38;5;101m',
  _256_ForegroundOrange208   = '\x1B[38;5;208m'
}

export enum BackgroundColor {
  _8_BackgroundBlack         = '\x1b[40m',
  _8_BackgroundRed           = '\x1b[41m',
  _8_BackgroundGreen         = '\x1b[42m',
  _8_BackgroundYellow        = '\x1b[43m',
  _8_BackgroundBlue          = '\x1b[44m',
  _8_BackgroundMagenta       = '\x1b[45m',
  _8_BackgroundCyan          = '\x1b[46m',
  _8_BackgroundWhite         = '\x1b[47m',
  _256_Blueish27             = '\x1b[48;5;27m',
  _256_BackgroundGrayish101  = '\x1B[48;5;101m',
  _256_BackgroundDullGreen29 = '\x1B[48;5;29m',
  _256_BackgroundOrange208   = '\x1B[48;5;208m'

}

export enum utf8SpecialCharacters {
  RighwardsArrow      = '\u2192',
  WhiteRightArrow     = '\u21E8',
  WhiteHeavyCheckMark = '\u2705',
  HeavyCheckmark      = '\u2714'
}
