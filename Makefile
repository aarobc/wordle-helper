setup:
	git submodule init
	git submodule update

cheat:
	NODE_NO_WARNINGS=1 node --experimental-json-modules ./cheat.mjs
