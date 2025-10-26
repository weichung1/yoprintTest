import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../app/store'
import { setQuery, fetchAnimeList } from '../features/anime/animeSlice'

export default function SearchBar() {
  const dispatch = useDispatch<AppDispatch>()
  const [text, setText] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (text.trim() === '') return

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      dispatch(setQuery(text))
      dispatch(fetchAnimeList({ query: text, page: 1 }))
    }, 250)

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [text, dispatch])

  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search anime..."
      className="p-2 border rounded w-full"
    />
  )
}
