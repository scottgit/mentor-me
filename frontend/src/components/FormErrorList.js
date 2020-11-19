import React from 'react'

const FormErrorList = ({errors}) => {
  if (errors.length) {
    return (
      <ul className='error-list'>
        {errors.map((err, idx) => <li key={idx}>{err}</li>)}
      </ul>
    )
  }
  else {
    return <></>;
  }

}

export default FormErrorList
