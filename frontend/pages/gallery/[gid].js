import { useRouter } from 'next/router'

const Gallery = () => {
  const router = useRouter()
  const { gid } = router.query

  return <p>Gallery: {gid}</p>
}

export default Gallery