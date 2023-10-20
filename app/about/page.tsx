import React from "react";
import AuthMessage from "@/components/auth-message";
import SupabaseData from "@/components/supabase-data";
import Users from "@/components/users";

function About() {
  const aboutMessage =
    "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.";

  return (
    <>
      <h1 className="text-4xl font-bold">About</h1>
      <div className="flex flex-col gap-4 w-full">{aboutMessage}</div>
      <Users />
      <SupabaseData />
      <AuthMessage />
    </>
  );
}

export default About;