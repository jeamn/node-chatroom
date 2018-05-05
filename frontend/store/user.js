export const state = () => ({
  username: null,
  nickname: null
})

export const mutations = {
  login (state, {username, nickname}) {
    state.username = username
    state.nickname = nickname
  },
  logout (state) {
    state.username = null
    state.nickname = null
  }
}