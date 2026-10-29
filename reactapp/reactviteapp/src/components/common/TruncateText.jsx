import React, { useState } from 'react'

function TruncateText({
  text = '',
  maxLength = 50,
  as: Component = 'span',
  className = '',
  singleLine = false,
  style = {},
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false)

  const isLong = text && text.length > maxLength
  const displayText = isLong && !isHovered ? `${text.slice(0, maxLength)}...` : text

  return (
    <Component
      className={className}
      title={text}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: isLong ? 'pointer' : 'inherit',
        whiteSpace: singleLine ? (isHovered ? 'normal' : 'nowrap') : undefined,
        wordBreak: isHovered ? 'break-word' : undefined,
        transition: 'all 0.2s ease',
        ...style,
      }}
      {...rest}
    >
      {displayText}
    </Component>
  )
}

export default TruncateText
