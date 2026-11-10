import { useState } from 'react'
import videoData from '../data/videos.json'

export const ticketVideos = (id) => (videoData.tickets[id] || []).map((v) => ({ id: v, ...videoData.videos[v] }))
export const playlist = videoData.playlist

/**
 * YouTube player that loads only after a click (privacy-friendly youtube-nocookie domain,
 * no YouTube scripts until the learner presses play).
 */
export function Video({ id, title, author, list }) {
  const [play, setPlay] = useState(false)
  const src = list
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${list}&autoplay=1`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
  const href = list ? `https://www.youtube.com/playlist?list=${list}` : `https://www.youtube.com/watch?v=${id}`

  return (
    <div className="video">
      <div className="video-frame">
        {play ? (
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className="video-poster" onClick={() => setPlay(true)} aria-label={`Atskaņot: ${title}`}>
            {id && <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />}
            <span className="video-play">▶</span>
          </button>
        )}
      </div>
      <div className="video-meta">
        <div>
          <strong>{title}</strong>
          {author && <span className="muted small"> · {author}</span>}
        </div>
        <a href={href} target="_blank" rel="noreferrer" className="small">YouTube ↗</a>
      </div>
    </div>
  )
}

/** All videos for a ticket; the first is the main one. */
export function TicketVideos({ ticketId }) {
  const vids = ticketVideos(ticketId)
  if (!vids.length) {
    return (
      <p className="muted small">
        Šai tēmai vēl nav sava video. Skaties <a href={`https://www.youtube.com/playlist?list=${playlist.id}`} target="_blank" rel="noreferrer">{playlist.author} CCNA kursu</a>.
      </p>
    )
  }
  return (
    <div className="videos">
      {vids.map((v) => <Video key={v.id} {...v} />)}
    </div>
  )
}
