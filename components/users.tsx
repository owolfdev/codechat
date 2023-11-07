import React from "react";
import { getAllUsers } from "@/lib/clerkUtils";

async function Users() {
  const users = await getAllUsers();

  return (
    <div className="flex flex-col gap-4">
      <div>Users:</div>
      <div className="flex flex-col gap-2">
        {users.map((user, index) => {
          return (
            <div key={user.id + index} className="flex gap-4 items-center">
              <div className="h-8 w-8">
                <img src={user.imageUrl} alt="profile image" />
              </div>
              <div>{user.emailAddresses[0].emailAddress}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Users;
