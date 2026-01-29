import React from 'react'

interface Props {
  width: string,
  border: string,
  position: string
}

export default function Spinner({width, border, position = "relative"}: Props) {
  return (
    <div className={`${position} spin ${width} aspect-square rounded-full border-dashed ${border} z-99`}></div>
  )
}