import React from "react";

/**
 * Defines the alert message to render if the specified error is truthy.
 * @param error
 *  an instance of an object with `.message` property as a string, typically an Error instance.
 * @returns {JSX.Element}
 *  a bootstrap danger alert that contains the message string.
 */

function ErrorAlert({ error }) {

  // Error objects have no unique ids associated with them. So keys are randomly assigned.
  const errorComp = (
    <div className="alert alert-danger m-1">
      <ul>
        {error?error.map((errors)=>{
            const keyGen = Math.floor(Math.random() * new Date().getTime()).toString();
            return (
              <li key={keyGen}>Error: {errors.message}</li>
            )
        }):null}
      </ul>
    </div>
    )

  if(Array.isArray(error) && error.length > 0){
    return errorComp
  } else {
    return null
  }
};

export default ErrorAlert
