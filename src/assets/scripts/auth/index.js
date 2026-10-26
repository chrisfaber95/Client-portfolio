import { HTTP } from '@/assets/scripts/http-common.js';
import router from '@/router';

export default {
    setUserinfo(data) {
        if (!data.err) {
            console.log(data)
            localStorage.setItem('user_id', data.user.id_token)
            localStorage.setItem('cardnumber', data.user.cardnumber)
            localStorage.setItem('access_token', data.user.access_token)
            localStorage.setItem('permissions', data.user.permissions)
            localStorage.setItem('expires', Date.now() + data.user.expires_in)
            router.push('/')
        } else {
            alert(data.err)
        }
    },
    login(email, pass) {
        const data = {
            email: email,
            pass: pass
        }
        console.log(data)
        HTTP.post("user/login", data)
            .then(response => {
                var userdata = response.data
                this.setUserinfo(userdata)
            })
            .catch(e => {
                console.log(e)
            })
    },
    logout() {
        localStorage.clear();
        router.push('/')
    },
    register(data) {
        const user = {
            firstName: data[0],
            lastName: data[0],
            username: data[0],
            pass: data[0],
            email: data[0],
            role_id: ''
        }
        HTTP.post("user/register", user)
            .then(response => {
                if (!response.data.err) {
                    alert(response.data)
                } else {
                    alert(response.data.err)
                }
            })
            .catch(e => {
                console.log(e)
            })
    },
    isAuthenticated() {
        if (localStorage.getItem('expires') > Date.now() && localStorage.getItem('access_token')) {
            return true
        } else {
            this.logout()
            return false
        }
    },
    isAdmin() {
        if (this.isAuthenticated() && (localStorage.getItem('permissions') == 2 || localStorage.getItem('permissions') == 1)) {
            return true;
        } else {
            return false;
        }
    },
    updateInfo() {
        const data = JSON.parse(localStorage.getItem("userinfo"))
        const id = JSON.parse(localStorage.getItem('id_token'))
        HTTP.put("user/update/" + id, data)
            .then(response => {
                console.log(response.data)
                localStorage.setItem('userinfo', JSON.stringify(response.data.user))
                this.user.info.userinfo = JSON.parse(localStorage.getItem('userinfo'))
            })
            .catch(e => {
                console.log(e)
            })
    },
    getInfo() {
        const id = localStorage.getItem("id_token");

        HTTP.get("user/single/" + id)
            .then(response => {
                console.log(response)
                localStorage.setItem('userinfo', JSON.stringify(response.data.user))
                this.user.info.userinfo = JSON.parse(localStorage.getItem('userinfo'))

            })
            .catch(e => {
                console.log(e)
            })
    },
    showInfo() {
        return this.user.info.userinfo;
    }
}