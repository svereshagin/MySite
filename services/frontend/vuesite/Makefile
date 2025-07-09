
build-static:
	npm run build
change-server-static:
	scp -r -C dist/* root@185.120.59.254:/var/www/proggyit.ru
	sudo systemctl restart nginx