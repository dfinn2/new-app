import { logout } from './actions'

export default function Logout() {
return (
<form action={logout}>
    <button type="submit">Logout</button>
</form>
)
}