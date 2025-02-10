<script lang="ts">
</script>

<nav class="HeaderWrapper">
	<div class="Header">
		<div class="Header__left">NFR Elicitation</div>
		<div class="Header__right"></div>
	</div>
</nav>

<style lang="scss">
	.HeaderWrapper {
		@include box(100vw, 60px);
		top: 0;
		left: 0;
		right: 0;
		gap: 10px;
		z-index: 5;
		position: fixed;
		padding: 15px 20px;
		@include box(100%, 64px);
		@include make-flex($dir: row);
		background: #f6f8fa;
		border-bottom: 1px solid var(--t-crp-border);
	}
	.Header {
		@include box();
		max-width: 800px;
		@include make-flex($dir: row, $just: space-between);

		&__left {
			font-size: 25px;
			font-weight: 700;
		}
	}
</style>
