<template>
    <div>
        <h1>{{ likes }}</h1>
        <my-button @click="addLike" >increment</my-button>
        <h1>Страница с постами</h1>
        <my-input
            v-focus
            v-model="searchQuery"
            placeholder="Поиск по названию"
        />
        <div class="app__btns" >
            <my-button
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
            <PostForm/>
        </my-dialog>
        <PostList :posts="sortedAndSearchedPosts" v-if="!isPostLoading" />
        <div v-else >Идет загрузка...</div>
    </div>
</template>

<script>
import PostForm from "@/components/PostForm.vue"
import PostList from "@/components/PostList.vue"
import usePosts from "@/hooks/usePosts"
import useSortedPosts from "@/hooks/useSortedPosts"
import useSortedAndSearchedPosts from "@/hooks/useSortedAndSearchedPosts"


    export default {
        components: {
            PostList, PostForm
        },
        data() {
            return {
                dialogVisible: false,
                sortOptions: [
                    {value: 'title', name: 'По названию'},
                    {value: 'body', name: 'По содержимому'},
                    {value: 'ID', name: 'По ID'},
                ]
            }
        },
        setup(props) {
            const {posts, totalPages, isPostLoading} = usePosts(10)
            const { selectedSort, sortedPosts } = useSortedPosts(posts)
            const { searchQuery, sortedAndSearchedPosts } = useSortedAndSearchedPosts(sortedPosts)

            return {
                posts,
                totalPages,
                isPostLoading,
                selectedSort,
                sortedPosts,
                searchQuery,
                sortedAndSearchedPosts,
            }
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

