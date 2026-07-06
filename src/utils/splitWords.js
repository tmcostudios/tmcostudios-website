export default function splitWords(el) {
  const text = el.textContent
  el.textContent = ''
  const allChars = []
  text.split(' ').forEach((word, wi) => {
    if (wi > 0) {
      const space = document.createElement('span')
      space.innerHTML = '&nbsp;'
      space.style.display = 'inline-block'
      el.appendChild(space)
    }
    const wordWrap = document.createElement('span')
    wordWrap.style.display = 'inline-flex'
    wordWrap.style.overflow = 'hidden'
    word.split('').forEach((c) => {
      const span = document.createElement('span')
      span.textContent = c
      span.style.display = 'inline-block'
      span.style.willChange = 'transform, opacity'
      wordWrap.appendChild(span)
      allChars.push(span)
    })
    el.appendChild(wordWrap)
  })
  return allChars
}
