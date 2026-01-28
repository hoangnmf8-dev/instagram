import React from 'react'

interface Props {
  width: string,
  border: string
}

export default function Loading({width, border}: Props) {
  return (
    <div className={`spin ${width} aspect-square rounded-full border-dashed ${border}`}></div>
  )
}