.DEFAULT_GOAL := sync

plugin?="badger"
format?="yaml"
api?="v3"
recreate?="false"

.PHONY: sync
sync: 
	docker build -t octopus .
	docker run -it --rm --network=host \
		-v ./.env:/opt/app/.env \
		-v ./example/volume:/etc/octopus \
		-v ./example/sample-$(plugin)-project:/project \
			octopus \
				path=/project \
				plugin=$(plugin) \
				format=$(format) \
				api=$(api) \
				recreate=$(recreate)
				

# TO RUN SAMPLE
# make sync