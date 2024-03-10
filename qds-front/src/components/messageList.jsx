import React from 'react';
import { Link } from 'react-router-dom';

export function MessageList({ users, loggedInUserId }) {
    console.log("users: ", users);
    return (
        <div>
            <h2>Select a User to Chat With</h2>
            <div>
                {users && loggedInUserId && users.map((user) => (
                    <p key={user.id}>
                        <Link to={`/chat/${loggedInUserId}/${user.id}`}>
                            {user.username}
                        </Link>
                    </p>
                ))}
            </div>
        </div>
    )
}