<template>
    <div>
        <h1>Страница с постами</h1>
        <my-input
            v-focus
            :model-value="searchQuery"
            @update:model-value="setSearchQuery"
            placeholder="Поиск по названию"
        />
        <div class="app__btns" >
            <my-button
                @click="showDialog"
            >
                Создать пост
            </my-button>

            <my-select
            :model-value="selectedSort"
            @update:model-value="setSelectedSort"
            :options="sortOptions"
            />

        </div>

        <my-dialog v-model:show="dialogVisible" >
            <PostForm @create="createPost" />
        </my-dialog>
        <PostList @remove="removePost" :posts="sortedAndSearchedPosts" v-if="!isPostLoading" />
        <div v-else >Идет загрузка...</div>
        <div v-intersection="loadMorePosts" class="observer"></div>
        <div class="page__wrapper">
            <div 
            @click="changePage(pageNumber)"
            :key="pageNumber"
            class="page"
            :class="{
                'current-page': page === pageNumber
            }"
            v-for="pageNumber in totalPages" 
            >{{ pageNumber }}</div>
        </div>
    </div>
</template>

<script>
import PostForm from "@/components/PostForm.vue"
import PostList from "@/components/PostList.vue"
import {mapState, mapGetters, mapMutations, mapActions} from "vuex"

    export default {
        components: {
            PostList, PostForm
        },
        data() {
            return {
                dialogVisible: false,
            }
        },
        methods: {
            ...mapMutations({
                setPage: 'post/setPage',
                setSearchQuery: 'post/setSearchQuery',
                setSelectedSort: 'post/setSelectedSort'
            }),
            ...mapActions({
                loadMorePosts: 'post/loadMorePosts',
                fetchPosts: 'post/fetchPosts',
            }),

            createPost(post) {
                this.posts.push(post)
                this.dialogVisible = false
            },
            removePost(post) {
                this.posts = this.posts.filter(p => p.id !== post.id)
            },
            showDialog() {
                this.dialogVisible = true
            },
            
        },
        mounted() {
            this.fetchPosts()
        },
        computed: {
            ...mapState({
                posts: state => state.post.posts,
                isPostLoading: state => state.post.isPostLoading,
                selectedSort: state => state.post.selectedSort,
                searchQuery: state => state.post.searchQuery,
                page: state => state.post.page,
                limit: state => state.post.limit,
                totalPages: state => state.post.totalPages, 
                sortOptions: state => state.post.sortOptions,
            }),
            ...mapGetters({
                sortedPosts: 'post/sortedPosts',
                sortedAndSearchedPosts: 'post/sortedAndSearchedPosts',
            })
        },
        watch: {}
    }
</script>

<style>

.app__btns {
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
}

.page__wrapper {
    display: flex;
    margin-top: 15px;
}

.page {
    cursor: pointer;
    border: 1px solid black;
    padding: 10px;
}

.current-page {
    border: 2px solid teal;
}

.observer {
    height: 10px;
}

</style>

