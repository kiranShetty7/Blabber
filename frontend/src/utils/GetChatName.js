
export const getUserName = (usersArray) => {

    console.log(usersArray)
    const userId = localStorage.getItem('userId')
    const user = usersArray?.filter((userItem) => userItem._id !== userId)

    if(user?.length>0)
    return user[0]?.name
  }