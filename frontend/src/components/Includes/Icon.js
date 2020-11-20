import React from 'react'

const Icon = ({icon, wrapperClasses='', click=''}) => {
  return (
    <div className={`icon ${wrapperClasses}`}>
      <i className={`fas fa-${icon}`} onClick={click}></i>
    </div>
  )
}

export default Icon
