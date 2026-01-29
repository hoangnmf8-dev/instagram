import Spinner from "./Spinner"

interface Props {
  width: string,
  border: string,
  position: string
}
export default function Loading({width="w-10", border="border-4 border-insta-blue", position = "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"}: Props) {
  return (
    <div className="fixed inset-0 bg-white backdrop-blur-sm z-90">
      <Spinner width={width} border={border} position={position} />
    </div>
  )
}
