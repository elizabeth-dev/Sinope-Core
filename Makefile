package package.docker:
	@sh -c "'$(CURDIR)/scripts/package.docker.sh'"

run run.local:
	@sh -c "'$(CURDIR)/scripts/run.local.sh'"
