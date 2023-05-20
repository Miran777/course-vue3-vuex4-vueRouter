<template>
    <form @submit.prevent >
        <h4>Создание поста</h4>
        <my-input 
        v-model="post.title"
        v-focus
        type="text" placeholder="Название"
        />
        <my-input
        v-model="post.body"
        type="text" placeholder="Описание"
        />
        <my-button @click="createPost" class="btn">Создать пост</my-button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                post: {
                    title: '',
                    body: ''
                }
            }
        },
        methods: {
            createPost() {
                this.post.id = Date.now()
                this.$emit('create', this.post)
                this.post = {
                    title: '',
                    body: ''
                }
            }
        },
    }
</script>

<style scoped>
form {
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.btn {
    margin-top: 15px;
    align-self: flex-end;
}

</style>