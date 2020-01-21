Rails.application.routes.draw do
  get 'app/show'
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' } do
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  mount ActionCable.server => '/cable'

  namespace :api do

    resource :logins, only: [ :show, :create ]
    resources :spaces do
      resources :pieces, shallow: true do
        resources :assets, controller: "piece_assets", only: :create
        collection do 
          post :save_as
        end
      end
    end
  end

  get "/ar-file/:id/*name", to: "api/piece_assets#show"

  get "/app", to: redirect("/spaces")

  resource :account, only: :show

  resources :spaces do
    resources :user_spaces
  end
  get "/discourse/sso", to: "discourse_sso#sso"

  get "/hello", to: "home#hello"
  get "/privacy-policy", to: "home#privacy"
  root to: "home#index"
end
