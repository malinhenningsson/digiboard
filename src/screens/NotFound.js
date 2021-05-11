import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div id="not-found">
			<div>
				<h1>404 Not Found</h1>
				<h2>Return to <Link to="/">home page</Link></h2>
			</div>
		</div>
	)
}

export default NotFound
