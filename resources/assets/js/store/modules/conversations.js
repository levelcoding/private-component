import api from '../api/all'
import conversation from './conversation'
import Pusher from 'pusher-js'

const state = {
    conversations: [],
    loadingConversations: false
}

const getters = {
    allConversations: state => {
        return state.conversations
    },
    loadingConversations: state => {
        return state.loadingConversations
    }
}

const actions = {
    getConversations ({dispatch, commit}, page) {
        commit('setConversationsLoading', true)

        api.getConversations(1).then((response) => {
            commit('setConversations', response.data.data)
            commit('setConversationsLoading', false)

            if (Laravel.user === typeof(null)) {
                console.log("User is null!!");
                console.log(Laravel);
                return;
            }

            Echo.private('user.' + Laravel.user.id)
                .listen('ConversationCreated', (e) => {
                    commit('prependToConversations', e.data)
                })
                .listen('ConversationReplyCreated', (e) => {
                    commit('prependToConversations', e.data.parent.data)
                })
                .listen('ConversationUsersCreated', (e) => {
                    commit('updateConversationInList', e.data)
                })
        })
    }
}

const mutations = {
    setConversations (state, conversations) {
        state.conversations = conversations
    },
    setConversationsLoading (state, status) {
        state.loadingConversations = status
    },
    prependToConversations (state, conversation) {
        state.conversations = state.conversations.filter((c) => {
            if (c === typeof(null)) {
                console.log("User is null!!");
                return false;
            }

            return c.id !== conversation.id
        })

        state.conversations.unshift(conversation)
    },
    updateConversationInList (state, conversation) {
        state.conversations = state.conversations.map((c) => {
            if (c === typeof(null)) {
                console.log("User is null!!");
                return null;
            }

            if (c.id == conversation.id) {
                return conversation
            }

            return c
        })
    }
}

const modules = {
    conversation: conversation
}

export default {
    state,
    getters,
    mutations,
    actions,
    modules
}