import React from 'react'

const Icon = ({icon}) => {
  return (
    <div className="icon">
      <i className={`fas fa-${icon}`}></i>
    </div>
  )
}

export default Icon
