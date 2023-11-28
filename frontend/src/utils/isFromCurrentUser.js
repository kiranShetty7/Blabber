export const isFromCurrentUser = (id) => {
    const currentUserId = localStorage.getItem('userId')
    if (id === currentUserId)
        return true
    return false
}

