import React from "react";

import UsersList from "../components/UsersList";

const Users = () => {
    const USERS = [
        {id: 'u1', name: 'Dmytro', image: 'https://www.lukas-petereit.com/wp-content/uploads/2017/10/Rakotzbr%C3%BCcke-Bridge-Rakotz-Kromlau-Lake-Sun-Sunrise-Landscape-Reflection-Germany-Saxony-Travel-Photography-Nature-Photo-Spreewald-2.jpg', places: 3}
    ];
    return <UsersList items={USERS} />
}

export default Users;