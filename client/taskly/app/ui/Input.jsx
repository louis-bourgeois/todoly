import { forwardRef, useMemo } from "react";

const Input = forwardRef(
  (
    {
      name,
      type = "text",
      autoComplete,
      placeholder,
      additionalStyles = "",
      autoDimensions = false,
      flexShrinkGrow = false,
      value,
      onChange,
      id,
      visible, // La prop 'visible' est la clé ici
      required = false,
      disabled = false,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    // --- DÉBUT DE LA MODIFICATION ---

    // On supprime la constante 'isPassword' qui était trop restrictive.
    // La nouvelle logique se base directement sur la prop 'type'.
    const inputType = useMemo(() => {
      // Si le composant est censé être un champ de mot de passe...
      if (type === "password") {
        // ...alors on bascule son type HTML entre 'text' et 'password'
        // en fonction de l'état de visibilité parent.
        return visible ? "text" : "password";
      }
      // Pour tous les autres types d'input (text, email, etc.), on retourne le type tel quel.
      return type;
    }, [type, visible]);

    // --- FIN DE LA MODIFICATION ---

    const handleChange = (e) => {
      onChange?.(e);
    };

    const className = useMemo(() => {
      // Le reste du composant n'a pas besoin de savoir si c'est un mot de passe ou non,
      // on peut simplifier ici aussi.
      const isPasswordField = type === "password";

      const baseClasses = `
        bg-transparent
        font-light
        appearance-none
        text-secondary
        transition-all duration-200 ease-in-out
        w-full
        leading-tight 
        px-5
        h-14
        text-text
        text-m
        placeholder:text-m
        lg:text-lg
        lg:placeholder:text-lg
        placeholer:text-text
        text-base
        focus:outline-none
      `;

      const conditionalClasses = `
        ${flexShrinkGrow ? "flex-grow flex-shrink" : ""}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${!isPasswordField ? "border border-secondary rounded-2xl" : ""}
        ${autoDimensions ? "min-w-[300px]" : ""}
      `;

      return `${baseClasses} ${conditionalClasses} ${additionalStyles}`.trim();
    }, [
      flexShrinkGrow,
      disabled,
      type, // On remplace isPassword par type
      autoDimensions,
      additionalStyles,
    ]);

    return (
      <input
        ref={ref}
        id={id}
        value={value}
        name={name}
        type={inputType} // Utilise notre nouvelle logique
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${className}`}
        required={required}
        onChange={handleChange}
        disabled={disabled}
        aria-invalid={false}
        aria-describedby={ariaDescribedBy}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;