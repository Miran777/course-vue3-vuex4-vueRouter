<template>
    <div>
        <h1>Страница с постами</h1>
        <my-input
            v-focus
            v-model="searchQuery"
            placeholder="Поиск по названию"
        />
        <div class="app__btns" >
            <my-button
                @click="showDialog"
            >
                Создать пост
            </my-button>

            <my-select
            v-model="selectedSort"
            :options="sortOptions"
            >

            </my-select>
        </div>

        <my-dialog v-model:show="dialogVisible" >
            <PostForm @create="createPost" />
        </my-dialog>
        <PostList @remove="removePost" :posts="sortedAndSearchedPosts" v-if="!isPostLoading" />
        <div v-else >Идет загрузка...</div>
        <div v-intersection="loadMorePosts" class="observer"></div>
        <!-- <div class="page__wrapper">
            <div 
            @click="changePage(pageNumber)"
            :key="pageNumber"
            class="page"
            :class="{
                'current-page': page === pageNumber
            }"
            v-for="pageNumber in totalPages" 
            >{{ pageNumber }}</div>
        </div> -->
    </div>
</template>

<script>
import PostForm from "@/components/PostForm.vue"
import PostList from "@/components/PostList.vue"
import axios from "axios"

    export default {
        components: {
            PostList, PostForm
        },
        data() {
            return {
                posts: [],
                dialogVisible: false,
                isPostLoading: false,
                selectedSort: '',
                searchQuery: '',
                page: 1,
                limit: 10,
                totalPages: 0, 
                sortOptions: [
                    {value: 'title', name: 'По названию'},
                    {value: 'body', name: 'По содержимому'},
                    {value: 'ID', name: 'По ID'},
                ]
            }
        },
        methods: {
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
            // changePage(pageNumber) {
            //     this.page = pageNumber
            // },
            async fetchPosts() {
                try {
                    this.isPostLoading = true
                    const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
                        params: {
                            _page: this.page,
                            _limit: this.limit,
                        }
                    })
                    this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limit)
                    this.posts = response.data
                } catch (error) {
                    alert('Ошибка: ', error.status)
                } finally {
                    this.isPostLoading = false
                }
                
            },
            async loadMorePosts() {
                try {
                    this.page += 1
                    const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
                        params: {
                            _page: this.page,
                            _limit: this.limit,
                        }
                    })
                    this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limit)
                    this.posts = [...this.posts, ...response.data]
                } catch (error) {
                    alert('Ошибка: ', error.status)
                } 
            }
        },
        mounted() {
            this.fetchPosts();
        },
        computed: {
            sortedPosts() {
                return [...this.posts].sort((post1, post2) => {
                    return post1[this.selectedSort]?.localeCompare(post2[this.selectedSort])
                })
            },
            sortedAndSearchedPosts() {
                return this.sortedPosts.filter(post => post.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
            }
        },
        watch: {
            // page() {
            //     this.fetchPosts()
            // }
        }
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

