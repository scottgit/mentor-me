import React from 'react';
import {NavLink} from 'react-router-dom';

const DiscussionNav = ({connections, othersRole}) => {
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
                const {id: dId, title} = dis;
                return (
                  <li key={`d${dId}`}
                  className={`discussions-nav__dis-item`}>
                    <NavLink to={{
                      pathname: `/discussions/c/${cId}/d/${dId}`,
                      state: {
                        connectionId: cId,
                        type: 'listing'
                      }
                    }}
                    className={`discussions-nav__link`}><span>{title}</span></NavLink>
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
