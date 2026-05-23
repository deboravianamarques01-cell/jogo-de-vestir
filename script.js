// Dados das roupas
const clothingData = {
    tops: {
        'camiseta': { emoji: '👕', label: 'Camiseta', color: '#FF6B6B' },
        'blusa': { emoji: '👚', label: 'Blusa', color: '#4ECDC4' },
        'vestido': { emoji: '👗', label: 'Vestido', color: '#FFE66D' },
        'jaqueta': { emoji: '🧥', label: 'Jaqueta', color: '#95E1D3' },
        'sueter': { emoji: '🧶', label: 'Suéter', color: '#F38181' },
        'regata': { emoji: '🏃', label: 'Regata', color: '#AA96DA' }
    },
    bottoms: {
        'saia': { emoji: '👗', label: 'Saia', color: '#FF6B6B' },
        'calca-jeans': { emoji: '👖', label: 'Calça Jeans', color: '#4A7C8C' },
        'short': { emoji: '🩳', label: 'Short', color: '#FFE66D' },
        'legging': { emoji: '🖤', label: 'Legging', color: '#000000' },
        'calca-rosa': { emoji: '👖', label: 'Calça Rosa', color: '#FFB6D9' },
        'calca-verde': { emoji: '👖', label: 'Calça Verde', color: '#95E1D3' }
    },
    feet: {
        'tenis': { emoji: '👟', label: 'Tênis', color: '#FF6B6B' },
        'sandalia': { emoji: '👡', label: 'Sandália', color: '#FFE66D' },
        'bota': { emoji: '🥾', label: 'Bota', color: '#4A7C8C' },
        'sapato': { emoji: '👞', label: 'Sapato', color: '#000000' },
        'rasteira': { emoji: '👡', label: 'Rasteira', color: '#95E1D3' },
        'scarpin': { emoji: '👠', label: 'Scarpin', color: '#F38181' }
    }
};

// Estado do personagem
let characterState = {
    top: null,
    bottom: null,
    feet: null
};

// Carregar estado salvo do localStorage
function loadCharacterState() {
    const saved = localStorage.getItem('characterOutfit');
    if (saved) {
        characterState = JSON.parse(saved);
        updateDisplay();
    }
}

// Salvar estado no localStorage
function saveCharacterState() {
    localStorage.setItem('characterOutfit', JSON.stringify(characterState));
}

// Atualizar a exibição do personagem
function updateDisplay() {
    const topDisplay = document.getElementById('topDisplay');
    const bottomDisplay = document.getElementById('bottomDisplay');
    const feetDisplay = document.getElementById('feetDisplay');

    // Top
    if (characterState.top) {
        const topInfo = clothingData.tops[characterState.top];
        topDisplay.style.backgroundColor = topInfo.color;
        topDisplay.textContent = topInfo.emoji + ' ' + topInfo.label;
        topDisplay.style.borderStyle = 'solid';
    } else {
        topDisplay.style.backgroundColor = '#e0e0e0';
        topDisplay.textContent = '';
        topDisplay.style.borderStyle = 'dashed';
    }

    // Bottom
    if (characterState.bottom) {
        const bottomInfo = clothingData.bottoms[characterState.bottom];
        bottomDisplay.style.backgroundColor = bottomInfo.color;
        bottomDisplay.textContent = bottomInfo.emoji + ' ' + bottomInfo.label;
        bottomDisplay.style.borderStyle = 'solid';
    } else {
        bottomDisplay.style.backgroundColor = '#e0e0e0';
        bottomDisplay.textContent = '';
        bottomDisplay.style.borderStyle = 'dashed';
    }

    // Feet
    if (characterState.feet) {
        const feetInfo = clothingData.feet[characterState.feet];
        feetDisplay.style.backgroundColor = feetInfo.color;
        feetDisplay.textContent = feetInfo.emoji + ' ' + feetInfo.label;
        feetDisplay.style.borderStyle = 'solid';
    } else {
        feetDisplay.style.backgroundColor = '#e0e0e0';
        feetDisplay.textContent = '';
        feetDisplay.style.borderStyle = 'dashed';
    }

    // Atualizar seleção nos botões
    updateButtonStates();
}

// Atualizar estados dos botões (mostrar qual está selecionado)
function updateButtonStates() {
    document.querySelectorAll('.cloth-btn').forEach(btn => {
        btn.classList.remove('selected');
        
        const type = btn.getAttribute('data-type');
        const value = btn.getAttribute('data-value');

        if (
            (type === 'top' && characterState.top === value) ||
            (type === 'bottom' && characterState.bottom === value) ||
            (type === 'feet' && characterState.feet === value)
        ) {
            btn.classList.add('selected');
        }
    });
}

// Event listeners para os botões de roupa
document.querySelectorAll('.cloth-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        const value = this.getAttribute('data-value');

        // Alternar seleção
        if (type === 'top') {
            characterState.top = characterState.top === value ? null : value;
        } else if (type === 'bottom') {
            characterState.bottom = characterState.bottom === value ? null : value;
        } else if (type === 'feet') {
            characterState.feet = characterState.feet === value ? null : value;
        }

        saveCharacterState();
        updateDisplay();
    });
});

// Botão limpar
document.getElementById('clearBtn').addEventListener('click', function() {
    characterState = {
        top: null,
        bottom: null,
        feet: null
    };
    saveCharacterState();
    updateDisplay();
});

// Inicializar
loadCharacterState();
