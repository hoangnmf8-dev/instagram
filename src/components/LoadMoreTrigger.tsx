import { useEffect, useRef } from 'react'
type Props = {
  onLoadMore: () => void,
  disabled: boolean
}
export default function LoadMoreTrigger({onLoadMore, disabled}: Props) {
  const ref = useRef(null); //tham chiếu đến phần tử
  useEffect(() => { //Khởi chạy khi component được mount
    if(!ref.current || disabled) return;

    const observer = new IntersectionObserver(([entry]) => { //Khởi tạo đối tượng
      if(entry.isIntersecting) {
        onLoadMore(); //Gọi hàm fetchNextPage
      }
    }, {rootMargin: "400px"});

    observer.observe(ref.current); //Bắt đầu theo dõi
    return () => observer.disconnect(); //dọn dẹp khi component này hoặc component cha re-render, hoặc bị unmount
  }, [onLoadMore, disabled]);
  return (
    <div ref={ref} style={{height: "1px"}}></div>
  )
}
