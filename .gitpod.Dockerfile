FROM gitpod/workspace-full

USER gitpod

ENV GOPATH="/workspace/go"

# Oh My Zsh
RUN sudo chsh -s $(which zsh) $(whoami)
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" "--unattended"
## RUN curl -fsSLo $HOME/.oh-my-zsh/custom/themes/elizabeth.zsh-theme https://raw.github.com/elizabeth-dev/dotfiles/main/elizabeth.zsh-theme
## RUN curl -fsSLo $HOME/.zshrc https://raw.github.com/elizabeth-dev/dotfiles/main/.zshrc

# Zsh autosuggestions
RUN echo 'deb http://download.opensuse.org/repositories/shells:/zsh-users:/zsh-autosuggestions/xUbuntu_20.04/ /' | sudo tee /etc/apt/sources.list.d/shells:zsh-users:zsh-autosuggestions.list
RUN curl -fsSL https://download.opensuse.org/repositories/shells:zsh-users:zsh-autosuggestions/xUbuntu_20.04/Release.key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/shells_zsh-users_zsh-autosuggestions.gpg > /dev/null

# GCloud CLI
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -

# Install packages
RUN sudo install-packages zsh-syntax-highlighting zsh-autosuggestions google-cloud-cli

# AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    sudo ./aws/install
