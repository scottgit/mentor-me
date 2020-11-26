import React from 'react'

const DiscussionNav = ({connections, setViewId, setOtherName, othersRole}) => {
  return (
    <ul className={`discussions-nav__con-list`}>
      {connections.map(c => {
        const {connectionId: cId, discussions} = c;
        const name = c[othersRole];
        return (
          <li key={`c${cId}`} className={`discussions-nav__con-item`}>
          <div className={`discussions-nav__name`}>{name}</div>
            <ul className={`discussions-nav__dis-list`}>
              {discussions.map(dis => {
                const {id, title} = dis;
                return (

                  <li key={`d${id}`}
                  className={`discussions-nav__dis-item`} onClick={() => {
                    setOtherName(name)
                    setViewId(id)
                  }}>
                    <span>                    {title} 
                    </span>

                  </li>
                )
              })}
            </ul>
          </li>
        )
      })}
    </ul>
  )
}

export default DiscussionNav
