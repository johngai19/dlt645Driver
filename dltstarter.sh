echo 'start to check node env:'
   if ! type node 2>/dev/null || [[ `node -v` != 'v8.16.2' ]] ; then
     echo 'node Running Enviroment Error, start to build...'
     curl -Ls -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
     export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
     source ~/.bashrc
     nvm install v8.16.2
     nvm alias default v8.16.2
    echo 'Node install success full'
    echo 'Install production package support'
    npm install -g cnpm --registry=https://registry.npm.taobao.org
    cnpm install --production
    echo 'success'
   fi
   npm start
echo 'end'