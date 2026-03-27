<script lang="ts">
    let { data } = $props();
</script>

<h1>Health Check</h1>

{#if data.error}
    <p style="color: red;">Error: {JSON.stringify(data.error)}</p>
{:else if data.data}
    <p>Status: {data.data.status}</p>
{:else}
    <p>Loading...</p>
{/if}
